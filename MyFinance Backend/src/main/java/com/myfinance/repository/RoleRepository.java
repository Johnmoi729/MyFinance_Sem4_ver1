package com.myfinance.repository;

import com.myfinance.entity.Role;
import com.myfinance.entity.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByRoleName(RoleName roleName);

    List<Role> findByIsActiveTrue();

    boolean existsByRoleName(RoleName roleName);
}