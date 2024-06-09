import Link from "next/link";

export default function ActionPage() {
  return (
    <>
      <Link href="/">Go to home page</Link>
      <form action={action}>
        <input type="text" name="name" placeholder="Name" />
        <input type="submit" value="Submit" />
      </form>
    </>
  );
}

const action = async (formData: FormData) => {
  "use server";
  await new Promise((resolve) => setTimeout(resolve, 500));
  return formData;
};
