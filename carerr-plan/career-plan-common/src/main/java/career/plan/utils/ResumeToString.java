package career.plan.utils;

import career.plan.dto.ResumeData;

/**
 * @author 胡志坚
 * @version 1.0
 * 创造日期 2025/4/13
 * 说明:
 */
public class ResumeToString {
    public static String formatResumeContent(ResumeData resumeData) {
        StringBuilder sb = new StringBuilder();

        // 基本信息
        if (resumeData.getBasics() != null) {
            sb.append("姓名: ").append(resumeData.getBasics().getName()).append("\n");
            sb.append("联系方式: ").append(resumeData.getBasics().getEmail()).append("\n");
        }

        // 教育背景
        if (resumeData.getEducation() != null) {
            sb.append("\n教育背景:\n");
            resumeData.getEducation().forEach(edu -> {
                sb.append("- ").append(edu.getInstitution()).append(": ")
                  .append(edu.getArea()).append(", ").append(edu.getStudyType())
                  .append("\n");
            });
        }

        // 工作经历
        if (resumeData.getWork() != null) {
            sb.append("\n工作经历:\n");
            resumeData.getWork().forEach(work -> {
                sb.append("- ").append(work.getName()).append(": ")
                  .append(work.getPosition()).append(" (")
                  .append(work.getStartDate()).append(" - ")
                  .append(work.getEndDate() != null ? work.getEndDate() : "至今")
                  .append(")\n");
            });
        }

        // 技能
        if (resumeData.getSkills() != null) {
            sb.append("\n技能:\n");
            resumeData.getSkills().forEach(skill -> {
                sb.append("- ").append(skill.getName());
                if (skill.getKeywords() != null && !skill.getKeywords().isEmpty()) {
                    sb.append(": ").append(String.join(", ", skill.getKeywords()));
                }
                sb.append("\n");
            });
        }

        // 语言能力
        if (resumeData.getLanguages() != null) {
            sb.append("\n语言能力:\n");
            resumeData.getLanguages().forEach(lang -> {
                sb.append("- ").append(lang.getLanguage()).append(": ").append(lang.getFluency()).append("\n");
            });
        }

        // 项目经历
        if (resumeData.getProjects() != null) {
            sb.append("\n项目经历:\n");
            resumeData.getProjects().forEach(project -> {
                sb.append("- ").append(project.getName()).append(": ")
                  .append(project.getDescription()).append(" (")
                  .append(project.getStartDate()).append(" - ")
                  .append(project.getEndDate() != null ? project.getEndDate() : "至今")
                  .append(")\n");
                if (project.getHighlights() != null && !project.getHighlights().isEmpty()) {
                    sb.append("  亮点:\n");
                    project.getHighlights().forEach(highlight -> sb.append("    - ").append(highlight).append("\n"));
                }
            });
        }

        // 获奖记录
        if (resumeData.getAwards() != null) {
            sb.append("\n获奖记录:\n");
            resumeData.getAwards().forEach(award -> {
                sb.append("- ").append(award.getTitle()).append(": ")
                  .append(award.getSummary()).append(" (")
                  .append(award.getDate()).append(", ")
                  .append(award.getAwarder()).append(")\n");
            });
        }

        // 证书
        if (resumeData.getCertificates() != null) {
            sb.append("\n证书:\n");
            resumeData.getCertificates().forEach(cert -> {
                sb.append("- ").append(cert.getName()).append(": ")
                  .append(cert.getIssuer()).append(" (")
                  .append(cert.getDate()).append(")\n");
                if (cert.getUrl() != null) {
                    sb.append("  链接: ").append(cert.getUrl()).append("\n");
                }
            });
        }

        return sb.toString();
    }

}
