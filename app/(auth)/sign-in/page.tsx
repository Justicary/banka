import AuthFormulario from "@/components/AuthFormulario";

const SignIn = () => {
  return (
    <section className="flex-center size-full max-sm:px-6">
      <AuthFormulario tipo="sign-in" />
    </section>
  );
};

export default SignIn;
