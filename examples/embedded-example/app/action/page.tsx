export default function ActionPage() {
  return (
    <form action={action}>
      <input type="text" name="name" placeholder="Name" />
      <input type="submit" value="Submit" />
    </form>
  );
}

const action = async (formData: FormData) => {
  "use server";
  return formData;
};
