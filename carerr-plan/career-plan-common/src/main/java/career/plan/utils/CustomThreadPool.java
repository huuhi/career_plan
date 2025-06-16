package career.plan.utils;

import java.util.HashSet;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.Executors;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;

public class CustomThreadPool {

    // 线程池状态
    private volatile boolean isRunning = true;
    
    // 核心线程数
    private final int corePoolSize;
    
    // 最大线程数
    private final int maximumPoolSize;
    
    // 线程空闲时间
    private final long keepAliveTime;
    
    // 时间单位
    private final TimeUnit unit;
    
    // 工作队列
    private final BlockingQueue<Runnable> workQueue;
    
    // 工作线程集合
    private final HashSet<Worker> workers = new HashSet<>();
    
    // 当前活跃线程数
    private final AtomicInteger activeCount = new AtomicInteger(0);
    
    // 拒绝策略
    private final RejectedExecutionHandler handler;

    // 线程工厂
    private final ThreadFactory threadFactory;

    public CustomThreadPool(int corePoolSize, int maximumPoolSize, long keepAliveTime, 
                           TimeUnit unit, BlockingQueue<Runnable> workQueue,
                           ThreadFactory threadFactory, RejectedExecutionHandler handler) {
        if (corePoolSize < 0 || maximumPoolSize <= 0 || maximumPoolSize < corePoolSize || keepAliveTime < 0) {
            throw new IllegalArgumentException();
        }
        this.corePoolSize = corePoolSize;
        this.maximumPoolSize = maximumPoolSize;
        this.keepAliveTime = keepAliveTime;
        this.unit = unit;
        this.workQueue = workQueue;
        this.threadFactory = threadFactory;
        this.handler = handler;
    }

    public CustomThreadPool(int corePoolSize, int maximumPoolSize, long keepAliveTime, 
                           TimeUnit unit, BlockingQueue<Runnable> workQueue,
                           RejectedExecutionHandler handler) {
        this(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue,
                (ThreadFactory) Executors.defaultThreadFactory(), handler);
    }

    public CustomThreadPool(int corePoolSize, int maximumPoolSize, long keepAliveTime, 
                           TimeUnit unit, BlockingQueue<Runnable> workQueue) {
        this(corePoolSize, maximumPoolSize, keepAliveTime, unit, workQueue, 
             new AbortPolicy());
    }

    public void execute(Runnable command) {
        if (command == null) {
            throw new NullPointerException();
        }
        
        // 如果线程池已关闭，拒绝任务
        if (!isRunning) {
            handler.rejectedExecution(command, this);
            return;
        }
        
        // 如果当前活跃线程数小于核心线程数，创建新线程
        if (activeCount.get() < corePoolSize) {
            if (addWorker(command, true)) {
                return;
            }
        }
        
        // 尝试将任务加入队列
        if (workQueue.offer(command)) {
            // 双重检查，防止线程池关闭
            if (!isRunning && workQueue.remove(command)) {
                handler.rejectedExecution(command, this);
            } else if (activeCount.get() == 0) {
                addWorker(null, false);
            }
        } 
        // 如果队列已满，尝试创建非核心线程
        else if (!addWorker(command, false)) {
            // 如果创建线程失败，执行拒绝策略
            handler.rejectedExecution(command, this);
        }
    }

    private boolean addWorker(Runnable firstTask, boolean core) {
        // 自旋增加线程数
        for (;;) {
            int c = activeCount.get();
            int max = core ? corePoolSize : maximumPoolSize;
            
            if (c >= max) {
                return false;
            }
            
            if (activeCount.compareAndSet(c, c + 1)) {
                break;
            }
        }
        
        boolean workerStarted = false;
        boolean workerAdded = false;
        Worker worker = null;
        try {
            worker = new Worker(firstTask);
            Thread t = worker.thread;
            if (t != null) {
                synchronized (workers) {
                    if (isRunning) {
                        workers.add(worker);
                        workerAdded = true;
                    }
                }
                
                if (workerAdded) {
                    t.start();
                    workerStarted = true;
                }
            }
        } finally {
            if (!workerStarted) {
                addWorkerFailed(worker);
            }
        }
        return workerStarted;
    }

    private void addWorkerFailed(Worker worker) {
        synchronized (workers) {
            if (worker != null) {
                workers.remove(worker);
            }
            activeCount.decrementAndGet();
        }
    }

    public void shutdown() {
        synchronized (workers) {
            isRunning = false;
            for (Worker worker : workers) {
                worker.interruptIfIdle();
            }
        }
    }

    public int getActiveCount() {
        return activeCount.get();
    }

    // Worker类，包装了工作线程
    private final class Worker implements Runnable {
        final Thread thread;
        Runnable firstTask;

        Worker(Runnable firstTask) {
            this.firstTask = firstTask;
            this.thread = threadFactory.newThread(this);
        }

        @Override
        public void run() {
            runWorker(this);
        }

        void interruptIfIdle() {
            Thread t = thread;
            if (!t.isInterrupted() && t.isAlive()) {
                try {
                    t.interrupt();
                } catch (SecurityException ignore) {
                }
            }
        }
    }

    final void runWorker(Worker worker) {
        Thread wt = Thread.currentThread();
        Runnable task = worker.firstTask;
        worker.firstTask = null;
        
        try {
            while (task != null || (task = getTask()) != null) {
                try {
                    task.run();
                } catch (RuntimeException x) {
                    throw x;
                } catch (Error x) {
                    throw x;
                } catch (Throwable x) {
                    throw new Error(x);
                } finally {
                    task = null;
                }
            }
        } finally {
            processWorkerExit(worker);
        }
    }

    private Runnable getTask() {
        boolean timedOut = false;
        
        for (;;) {
            if (!isRunning && workQueue.isEmpty()) {
                return null;
            }
            
            int c = activeCount.get();
            boolean timed = c > corePoolSize;
            
            if ((timed && timedOut) || (c > maximumPoolSize && c > 1)) {
                if (activeCount.compareAndSet(c, c - 1)) {
                    return null;
                }
                continue;
            }
            
            try {
                Runnable r = timed ?
                    workQueue.poll(keepAliveTime, unit) :
                    workQueue.take();
                if (r != null) {
                    return r;
                }
                timedOut = true;
            } catch (InterruptedException retry) {
                timedOut = false;
            }
        }
    }

    private void processWorkerExit(Worker worker) {
        synchronized (workers) {
            workers.remove(worker);
            activeCount.decrementAndGet();
        }
    }

    // 拒绝策略接口
    public interface RejectedExecutionHandler {
        void rejectedExecution(Runnable r, CustomThreadPool executor);
    }

    // 默认拒绝策略 - 直接抛出异常
    public static class AbortPolicy implements RejectedExecutionHandler {
        @Override
        public void rejectedExecution(Runnable r, CustomThreadPool executor) {
            throw new RejectedExecutionException("Task " + r.toString() + " rejected from " + executor.toString());
        }
    }

    // 调用者运行策略
    public static class CallerRunsPolicy implements RejectedExecutionHandler {
        @Override
        public void rejectedExecution(Runnable r, CustomThreadPool executor) {
            if (!executor.isRunning) {
                return;
            }
            r.run();
        }
    }

    // 丢弃策略
    public static class DiscardPolicy implements RejectedExecutionHandler {
        @Override
        public void rejectedExecution(Runnable r, CustomThreadPool executor) {
            // 什么都不做，直接丢弃
        }
    }

    // 丢弃最老策略
    public static class DiscardOldestPolicy implements RejectedExecutionHandler {
        @Override
        public void rejectedExecution(Runnable r, CustomThreadPool executor) {
            if (!executor.isRunning) {
                return;
            }
            executor.workQueue.poll();
            executor.execute(r);
        }
    }

    // 线程工厂接口
    public interface ThreadFactory {
        Thread newThread(Runnable r);
    }

    // 测试用例
    public static void main(String[] args) {
        CustomThreadPool pool = new CustomThreadPool(
            2, // corePoolSize
            4, // maximumPoolSize
            60, // keepAliveTime
            TimeUnit.SECONDS,
            new LinkedBlockingQueue<>(2), // 工作队列容量为2
            new CustomThreadPool.DiscardOldestPolicy() // 拒绝策略
        );

        for (int i = 0; i < 10; i++) {
            final int taskNum = i;
            pool.execute(() -> {
                System.out.println(Thread.currentThread().getName() + " 执行任务 " + taskNum);
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            });
        }

        pool.shutdown();
    }
}

class RejectedExecutionException extends RuntimeException {
    public RejectedExecutionException(String message) {
        super(message);
    }
}