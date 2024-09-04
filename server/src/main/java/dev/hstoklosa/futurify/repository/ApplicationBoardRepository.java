package dev.hstoklosa.futurify.repository;

import dev.hstoklosa.futurify.model.entity.ApplicationBoard;
import dev.hstoklosa.futurify.model.entity.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationBoardRepository extends JpaRepository<ApplicationBoard, Integer> {

    List<ApplicationBoard> findByUserAndArchived(User user, boolean archived, Sort sort);

}
