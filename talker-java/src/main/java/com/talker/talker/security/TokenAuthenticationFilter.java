package com.talker.talker.security;

import com.talker.talker.service.CustomUserDetailsService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Collections;
import static com.talker.talker.security.SecurityConstans.HEADER_STRING;

@Slf4j
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private TokenProvider tokenProvider;
    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse, FilterChain filterChain) throws ServletException, IOException {

        try {
            String clearJwt = httpServletRequest.getHeader(HEADER_STRING);

            if (StringUtils.hasText(clearJwt) && tokenProvider.validateToken(clearJwt)){
                Integer customerId = tokenProvider.getUserIdFromJWT(clearJwt);
                UserDetails user = customUserDetailsService.loadById(customerId);

                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(user,null, Collections.emptyList());

                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpServletRequest));
                SecurityContextHolder.getContext().setAuthentication(authentication);

            }
        }catch (Exception ex){
            log.error("Could not set user authentication",ex);
        }

        filterChain.doFilter(httpServletRequest,httpServletResponse);
    }
}
