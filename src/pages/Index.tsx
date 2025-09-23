import TypeWriter from "@/components/TypeWriter";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <TypeWriter 
        text="Building in Progress..." 
        speed={150}
        className="text-foreground"
        style={{ fontSize: "14px" }}
      />
    </div>
  );
};

export default Index;
