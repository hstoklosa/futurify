package dev.hstoklosa.futurify.config.filter;

import dev.hstoklosa.futurify.auth.service.JwtService;
import dev.hstoklosa.futurify.common.util.SecurityUtil;
import dev.hstoklosa.futurify.common.util.CookieUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {
    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
        @NonNull HttpServletRequest request,
        @NonNull HttpServletResponse response,
        @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            final String accessToken = CookieUtil.getAccessTokenFromCookie(request);
            
            if (accessToken == null) {
                log.debug("No access token found in request");
                filterChain.doFilter(request, response);
                return;
            }

            final String userEmail = jwtService.extractUsername(accessToken);
            
            if (userEmail == null) {
                log.warn("Could not extract username from token");
                filterChain.doFilter(request, response);
                return;
            }

            if (!SecurityUtil.isAuthenticated()) {
                try {
                    UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                    
                    if (jwtService.isTokenValid(accessToken, userDetails)) {
                        UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails, 
                            null, 
                            userDetails.getAuthorities()
                        );
                        
                        authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                        log.debug("Successfully authenticated user: {}", userEmail);
                    } else {
                        log.warn("Invalid token for user: {}", userEmail);
                    }
                } catch (UsernameNotFoundException e) {
                    log.error("User not found in database: {}", userEmail);
                } catch (Exception e) {
                    log.error("Error during authentication: {}", e.getMessage(), e);
                }
            }

            filterChain.doFilter(request, response);
        } catch (Exception e) {
            log.error("Unhandled error in JWT authentication filter: {}", e.getMessage(), e);
            filterChain.doFilter(request, response);
        }
    }
}
