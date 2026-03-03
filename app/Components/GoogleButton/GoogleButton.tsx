"use client";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";   
import axios from "axios";           
import toast from "react-hot-toast";
import { signinWithGoogleThunk } from "../../libs/redux/features/authSlice";
import google from "../../../public/search.png";
import Image from "next/image";
import { AppDispatch } from "@/app/libs/redux/store";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
const GoogleButton = () => {
  const dispatch:AppDispatch = useDispatch();
  const router:AppRouterInstance = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const accessToken = tokenResponse.access_token;
        
        const userInfo = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          { headers: { Authorization: `Bearer ${accessToken}` } },
        );

        const { email, name, picture } = userInfo.data;
        
        const googleUser = {
          token: accessToken,           
          email,
          name,
          picture,
        };

        const res = await dispatch(signinWithGoogleThunk(googleUser));
        
        if (res.meta.requestStatus === "fulfilled") {
          toast.success(res.payload?.message || "Login Successful");
          router.push("/");
        } else {
          toast.error(res.payload?.errMessage || "Login Failed");
        }
      } catch (error) {
        toast.error("Failed to fetch user info from Google");
      }
    },
    onError: () => toast.error("Google Login Failed"),
  });

  return (
    <button
      onClick={() => login()}    
      className="group relative w-full flex items-center justify-center gap-3 rounded-2xl px-2 py-2 bg-white/5 transition-all duration-300 border border-white/10 hover:border-white/20 overflow-hidden"
    >
      <Image src={google} alt={"google"} width={25} height={25} />
      <span className="font-medium">Continue with Google</span>
    </button>
  );
};

export default GoogleButton;
