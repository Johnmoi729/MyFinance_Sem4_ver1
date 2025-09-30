package com.myfinance.repository;

import com.myfinance.entity.Role;
import com.myfinance.entity.RoleName;
import com.myfinance.entity.User;
import com.myfinance.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {
    List<UserRole> findByUserIdAndIsActiveTrue(Long userId);

    List<UserRole> findByUserId(Long userId);

    @Query("SELECT ur.role FROM UserRole ur WHERE ur.userId = :userId AND ur.isActive = true")
    List<Role> findActiveRolesByUserId(@Param("userId") Long userId);

    @Query("SELECT ur.role.roleName FROM UserRole ur WHERE ur.userId = :userId AND ur.isActive = true")
    List<RoleName> findActiveRoleNamesByUserId(@Param("userId") Long userId);

    @Query("SELECT ur FROM UserRole ur WHERE ur.userId = :userId AND ur.role.roleName = :roleName AND ur.isActive = true")
    Optional<UserRole> findByUserIdAndRoleNameAndIsActiveTrue(@Param("userId") Long userId, @Param("roleName") RoleName roleName);

    @Query("SELECT COUNT(ur) > 0 FROM UserRole ur WHERE ur.userId = :userId AND ur.role.roleName = :roleName AND ur.isActive = true")
    boolean existsByUserIdAndRoleNameAndIsActiveTrue(@Param("userId") Long userId, @Param("roleName") RoleName roleName);

    @Query("SELECT COUNT(ur) FROM UserRole ur WHERE ur.role.roleName = :roleName AND ur.isActive = true")
    long countActiveUsersByRole(@Param("roleName") RoleName roleName);

    @Query("SELECT DISTINCT ur.userId FROM UserRole ur WHERE ur.role.roleName = :roleName AND ur.isActive = true")
    List<Long> findActiveUserIdsByRole(@Param("roleName") RoleName roleName);

    @Query("SELECT COUNT(ur) > 0 FROM UserRole ur WHERE ur.userId = :userId AND ur.role.id = :roleId AND ur.isActive = true")
    boolean existsByUserIdAndRoleId(@Param("userId") Long userId, @Param("roleId") Long roleId);

    @Query("SELECT COUNT(ur) > 0 FROM UserRole ur WHERE ur.role.id = :roleId AND ur.isActive = true")
    boolean existsByRoleId(@Param("roleId") Long roleId);
}