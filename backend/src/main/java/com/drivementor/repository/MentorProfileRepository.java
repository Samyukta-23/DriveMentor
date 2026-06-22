package com.drivementor.repository;

import com.drivementor.entity.MentorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface MentorProfileRepository extends JpaRepository<MentorProfile, UUID> {
    Optional<MentorProfile> findByUserId(UUID userId);
    List<MentorProfile> findByIsVerifiedTrue();
    List<MentorProfile> findByIsVerifiedFalse();

    @Query("SELECT mp FROM MentorProfile mp JOIN mp.user u WHERE " +
           "(u.role = 'MENTOR') AND " +
           "(:city IS NULL OR LOWER(u.city) = LOWER(:city)) AND " +
           "(:vehicleType IS NULL OR LOWER(mp.vehicleTypes) LIKE LOWER(CONCAT('%', :vehicleType, '%'))) AND " +
           "(:language IS NULL OR LOWER(mp.languages) LIKE LOWER(CONCAT('%', :language, '%'))) AND " +
           "(:minExperience IS NULL OR mp.experienceYears >= :minExperience) AND " +
           "(:minRating IS NULL OR mp.rating >= :minRating) AND " +
           "(:searchQuery IS NULL OR LOWER(u.fullName) LIKE LOWER(CONCAT('%', :searchQuery, '%')) OR LOWER(mp.bio) LIKE LOWER(CONCAT('%', :searchQuery, '%')))")
    List<MentorProfile> searchMentors(
        @Param("city") String city,
        @Param("vehicleType") String vehicleType,
        @Param("language") String language,
        @Param("minExperience") Integer minExperience,
        @Param("minRating") Double minRating,
        @Param("searchQuery") String searchQuery
    );
}
