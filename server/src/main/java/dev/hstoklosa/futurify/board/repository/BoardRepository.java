package dev.hstoklosa.futurify.board.repository;

import dev.hstoklosa.futurify.board.entity.Board;
import dev.hstoklosa.futurify.user.entity.User;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BoardRepository extends JpaRepository<Board, Integer> {

    List<Board> findByUserAndArchived(User user, boolean archived, Sort sort);

}
