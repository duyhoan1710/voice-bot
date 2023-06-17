import Header from "../components/Header";
import SignUp from "../components/SignUp";

export default function SignUpPage() {
  return (
    <div className="min-h-full h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Header
          heading="SignUp to create an account"
          paragraph="Already have an account? "
          linkName="Login"
          linkUrl="/sign-in"
        />
        <SignUp />
      </div>
    </div>
  );
}
