package career.plan.dto.resumeData;

import lombok.Data;
import java.util.List;

@Data
public class Basics {
    private String name;
    private String label;
    private String image;
    private String email;
    private String phone;
    private String url;
    private String summary;
    private Location location;
    private List<SocialProfile> profiles;

    @Data
    public static class Location {
        private String address;
        private String postalCode;
        private String city;
        private String countryCode;
        private String region;
    }

    @Data
    public static class SocialProfile {
        private String network;
        private String username;
        private String url;
    }
}