import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
     providers: [
      CredentialsProvider({
        name: "Credentials",
        credentials: {
          userName: { label: "userName", type: "text" },
          birthday: { label: "birthday", type: "text" },
          
        },
        async authorize(credentials) {
  
          const api_url = process.env.NEXT_PUBLIC_API_SERVER_URL;
          const userName = credentials?.userName ;
          const birthday = credentials?.birthday ;
  
          const response = await fetch(api_url+'/api/member/loginMember', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({userName , birthday}),
              }
          );
  
          const user = await response.json();
  
          if (!user[0]) {
              throw new Error("존재하지 않는 정보입니다.");
          } 
          
          return user[0]
        }
      })
    ],
  
    secret: process.env.NEXTAUTH_SECRET,
    
    session: {
      strategy: "jwt", 
      // 2. 세션 만료 시간 (초 단위) - 예: 30일
      //maxAge: 30 * 24 * 60 * 60, 
      // 3. 업데이트 주기 (초 단위) - 예: 24시간마다 세션 갱신
      //updateAge: 24 * 60 * 60, 
    },

    cookies: {
        sessionToken: {
        name: `next-auth.session-token`,
        options: {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            secure: process.env.NODE_ENV === "production",
            // maxAge를 설정하지 않으면 세션 쿠키가 됩니다.
        },
        },
    },

    callbacks: {
      async jwt({ token, user }) {
        if (user) {
          token.id = user.id;
          token.userName =  (user as any).userName;
          token.birthday = (user as any).birthday;
          token.mngrSe = (user as any).mngrSe;
        }
  
        return token;
      },
      async session({ session, token }) {
  
        if (session.user) {
          (session.user as any).id = token.id as string;
          (session.user as any).userName = token.userName as string;
          (session.user as any).birthday = token.birthday as string;
          (session.user as any).mngrSe = token.mngrSe as string;
        }
        return session;
      },
    },
};