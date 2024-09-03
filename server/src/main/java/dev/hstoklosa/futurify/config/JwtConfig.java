package dev.hstoklosa.futurify.config;

import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

@Data
@Configuration
public class JwtConfig {

    @Value("${security.jwt.secret-key}")
    private String secretKey;

    @Value("${security.jwt.access-token.expiration}")
    private long accessExpiration;

    @Value("${security.jwt.refresh-token.expiration}")
    private long refreshExpiration;

}
