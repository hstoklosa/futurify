package dev.hstoklosa.futurify.model.entity;

import dev.hstoklosa.futurify.model.enums.TokenType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class AccessToken {

    @Id
    @GeneratedValue
    public Integer id;

    @Column(unique = true, updatable = false, nullable = false)
    public String token;

    @Column(length = 32, nullable = false)
    @Enumerated(EnumType.STRING)
    public TokenType type = TokenType.BEARER;

    @Column(nullable = false)
    public boolean revoked;

    @Column(nullable = false)
    public boolean expired;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    public User user;

}
