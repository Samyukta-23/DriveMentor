package com.drivementor.repository;

import com.drivementor.entity.SkillAssessment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface SkillAssessmentRepository extends JpaRepository<SkillAssessment, UUID> {
    Optional<SkillAssessment> findByDriverId(UUID driverId);
}
