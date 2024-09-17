package dev.hstoklosa.futurify.board.repository;

import dev.hstoklosa.futurify.board.entity.ApplicationBoard;
import dev.hstoklosa.futurify.user.entity.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ApplicationBoardRepository extends JpaRepository<ApplicationBoard, Integer> {

    List<ApplicationBoard> findByUserAndArchived(User user, boolean archived, Sort sort);

}
