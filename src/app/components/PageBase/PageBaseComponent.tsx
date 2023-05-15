import { BASE_PATH } from "@/app/utils/constants";
import { Box } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

type PageBaseProps = {
  children: React.ReactNode;
};

export default function PageBase({ children }: PageBaseProps) {
	const router = useRouter();
  return (
    <>
      <Box
        bg="blue.500"
        w="100%"
        p={4}
        color="white"
        marginBottom="40px"
        textAlign="center"
				onClick={()=> router.push(BASE_PATH)}
      >
        Locations App!
      </Box>
      {children}
    </>
  );
}
