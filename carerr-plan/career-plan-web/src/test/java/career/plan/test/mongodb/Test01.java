//package career.plan.test.mongodb;
//
//import career.plan.domain.ChatMessages;
//import org.junit.jupiter.api.Test;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.boot.test.context.SpringBootTest;
//import org.springframework.data.mongodb.core.MongoTemplate;
//import org.springframework.data.mongodb.core.query.Criteria;
//import org.springframework.data.mongodb.core.query.Query;
//import org.springframework.data.mongodb.core.query.Update;
//
///**
// * @author 胡志坚
// * @version 1.0
// * 创造日期 2025/5/10
// * 说明:
// */
////@SpringBootTest
//public class Test01 {
////    @Autowired
//    private MongoTemplate mongoTemplate;
//
//    @Test
//    void testInsert() {
//        ChatMessages chatMessages = new ChatMessages();
//        chatMessages.setContent("聊天记录2");
//        mongoTemplate.insert(chatMessages);
//    }
//
//    @Test
//    void testFind() {
//        ChatMessages chatMessages = mongoTemplate.findById("681f5e16edc9214e5c0d5798", ChatMessages.class);
//        System.out.println(chatMessages);
//    }
//
//    @Test
//    void testUpdate(){
//        Criteria criteria = Criteria.where("_id").is("681f5e16edc9214e5c0d5798");
//        Query query = new Query(criteria);
//        Update update = new Update();
//        update.set("content","聊天记录2更新");
////        修改或新增
//        mongoTemplate.upsert(query,update,ChatMessages.class);
//    }
//    @Test
//    void testDelete(){
//        Criteria criteria = Criteria.where("_id").is("681f5e16edc9214e5c0d5798");
//        Query query = new Query(criteria);
//
////        删除
//        mongoTemplate.remove(query,ChatMessages.class);
//    }
//
//}
