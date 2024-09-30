package dev.hstoklosa.futurify.common.util;

import dev.hstoklosa.futurify.user.entity.User;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.security.authentication.AnonymousAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    public static boolean isAuthenticated() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return authentication != null && !(authentication instanceof AnonymousAuthenticationToken);
    }

    public static User getCurrentUser() {
        return (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    public static String sanitiseHtml(String html) {
        return Jsoup.clean(html, Safelist.basic());
    }

}
