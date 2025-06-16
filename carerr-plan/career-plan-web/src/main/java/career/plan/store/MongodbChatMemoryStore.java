package career.plan.store;

import career.plan.domain.ChatMessages;
import dev.langchain4j.data.message.ChatMessage;
import dev.langchain4j.data.message.ChatMessageDeserializer;
import dev.langchain4j.data.message.ChatMessageSerializer;


import dev.langchain4j.store.memory.chat.ChatMemoryStore;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;

import java.util.LinkedList;
import java.util.List;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/10
 * 说明:
 */
@Component
public class MongodbChatMemoryStore implements ChatMemoryStore {
    private final MongoTemplate template;

    public MongodbChatMemoryStore(MongoTemplate template) {
        this.template = template;
    }

    @Override
    public List<ChatMessage> getMessages(Object memoryId) {
        Criteria criteria = Criteria.where("memoryId").is(memoryId);
        Query query = new Query(criteria);
        ChatMessages chatMessages = template.findOne(query, ChatMessages.class);
        if(chatMessages==null){
            return new LinkedList<>();
        }
        String contentJson = chatMessages.getContent();
        return ChatMessageDeserializer.messagesFromJson(contentJson);
    }

    @Override
    public void updateMessages(Object memoryId, List<ChatMessage> list) {
        Criteria criteria = Criteria.where("memoryId").is(memoryId);
        Query query = new Query(criteria);
        Update update = new Update();
        update.set("content",ChatMessageSerializer.messagesToJson(list));
//        修改或新增
        template.upsert(query,update,ChatMessages.class);
    }

    @Override
    public void deleteMessages(Object memoryId) {
        Criteria criteria = Criteria.where("memoryId").is(memoryId);
        Query query = new Query(criteria);
//        删除
        template.remove(query, ChatMessages.class);
    }
}
