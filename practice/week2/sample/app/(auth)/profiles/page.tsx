import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 프로필 고르기 = 쿠키 저장 (mock login)
async function selectProfile(formData: FormData) {
  "use server";
  (await cookies()).set("profile", String(formData.get("name")));
  redirect("/browse");
}

async function clearProfile() {
  "use server";
  (await cookies()).delete("profile");
}

export default function ProfilesPage() {
  return (
    <div>
      <span className="file-label">app/(auth)/profiles/page.tsx</span>
      <h1>프로필을 선택하세요</h1>
      <form action={selectProfile} className="chips">
        <button name="name" value="채원" className="btn">
          채원
        </button>
        <button name="name" value="유림" className="btn">
          유림
        </button>
        <button name="name" value="효정" className="btn">
          효정
        </button>
        <button name="name" value="해니" className="btn">
          해니
        </button>
        <button name="name" value="기훈" className="btn">
          기훈
        </button>
        <button name="name" value="민식" className="btn">
          민식
        </button>
        <button name="name" value="주형" className="btn">
          주형
        </button>
        <button name="name" value="효비" className="btn">
          효비
        </button>
        <button name="name" value="예슬" className="btn">
          예슬
        </button>
      </form>
      <form action={clearProfile}>
        <button className="chip">쿠키 지우기 (proxy 테스트용)</button>
      </form>
    </div>
  );
}
