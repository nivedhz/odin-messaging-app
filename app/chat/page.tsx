import Navbar from "@/components/Navbar";
import { getUser } from "@/features/chat/user";
import { getSession } from "@/lib/auth/session";

const page = async () => {
  const session = await getSession();
  const user = (await getUser(session?.userId as string)) || null;
  return <Navbar username={user?.username} />;
};

export default page;
