package com.photogram.config.oauth;

import com.photogram.config.auth.PrincipalDetails;
import com.photogram.domain.user.User;
import com.photogram.domain.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class OAuth2DetailsService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);

        System.out.println("-------------------");
        System.out.println(oauth2User.getAttributes());

        Map<String, Object> userinfo = oauth2User.getAttributes();

        String username = "google_" + (String) userinfo.get("sub");
        String password = new BCryptPasswordEncoder().encode(UUID.randomUUID().toString());
        String name = (String) userinfo.get("name");
        String email = (String) userinfo.get("email");
        String profileImageUrl = (String) userinfo.get("picture");

        User userEntity = userRepository.findByUsername(username);

        if(userEntity == null){
            User user = User.builder()
                    .username(username)
                    .password(password)
                    .email(email)
                    .name(name)
                    .role("ROLE_USER")
                    .profileImageUrl(profileImageUrl)
                    .build();
            return new PrincipalDetails(userRepository.save(user), oauth2User.getAttributes());
        }else{
            return new PrincipalDetails(userEntity, oauth2User.getAttributes());
        }

    }
}
