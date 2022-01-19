package com.photogram.config.auth;

import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class PrincipalDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        User userEntity  = userRepository.findByUsername(username);

        if(userEntity == null) {
            return null;
        }else {
            return new PrincipalDetails(userEntity);
        }
    }

}