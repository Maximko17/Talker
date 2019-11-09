package com.talker.talker.repository;

import com.talker.talker.domain.Groups;
import org.springframework.data.jpa.repository.JpaRepository;

public interface GroupRepository extends JpaRepository<Groups,Integer> {
    Groups findByUri(String uri);
}
