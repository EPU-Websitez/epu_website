const Page = async ({ params }: { params: { id: string } }) => {
  const apiData = await getData();
  console.log(apiData);

  return (
    <div>
      My Post: {params.id}
      <h1>{apiData.title}</h1>
    </div>
  );
};
export default Page;

const getData = async () => {
  const res = await fetch(`https://jsonplaceholder.typicode.com/todos/1`);
  if (!res.ok) {
    throw new Error(`Failed to get data`);
  }
  return res.json();
};
