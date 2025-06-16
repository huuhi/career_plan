package career.plan.dto;

import career.plan.dto.resumeData.*;
import lombok.Data;

import java.util.List;

@Data
public class ResumeData {
    private Basics basics;
    private List<WorkExperience> work;
    private List<Education> education;
    private List<Skill> skills;
    private List<Language> languages;
    private List<Project> projects;
    private List<Award> awards;
    private List<Certificate> certificates;
    private List<Interest> interests;
}