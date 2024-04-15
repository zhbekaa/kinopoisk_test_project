import { Button, Flex, Result } from "antd";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <Flex justify="center" align="center">
      <Result
        status="404"
        title="404"
        subTitle="Упс, этой страницы не существует."
        extra={
          <Button type="primary" onClick={() => navigate("/")}>
            Back Home
          </Button>
        }
      />
    </Flex>
  );
}
