package career.plan.domain;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/5/10
 * 说明:
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Document("chat_message")
public class ChatMessages {

    @Id
    private ObjectId messageId;

    private String memoryId;

    private String content;

}
