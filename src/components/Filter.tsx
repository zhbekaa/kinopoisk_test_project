import { Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import { useEffect, useState } from "react";
import { FilterInterface } from "../interfaces/FilmInterfaces";
import { useDispatch } from "react-redux";
import { applyFilter } from "../state/films/filmSlice";
import { AppDispatch } from "../state/store";

const getYears = (startYear: number, endYear: number) => {
  const yearsArray = [];
  for (let year = startYear; year >= endYear; year--) {
    yearsArray.push({
      label: year,
      value: year,
    });
  }
  return yearsArray;
};

const Filter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [years, setYears] = useState<{ label: number; value: number }[]>([]);
  const [form] = useForm();
  useEffect(() => {
    const currentYear = new Date().getFullYear();
    const years = getYears(currentYear, 1890);
    setYears(years);
  }, []);

  return (
    <Form
      form={form}
      initialValues={{}} 
      onValuesChange={(_, values: FilterInterface) => {
        dispatch(applyFilter(values));
      }}
      layout="inline"
      style={{
        padding: "0 20px 0 20px",
      }}
    >
      <Form.Item label="Год выпуска от" name="yearFrom">
        <Select
          // mode="tags"
          style={{ width: 100 }}
          placeholder={years[0]?.label}
          // onChange={handleChange}
          options={years}
        />
      </Form.Item>
      <Form.Item label="По" name="yearTo">
        <Select
          // mode="tags"
          style={{ width: 100 }}
          placeholder={years[0]?.label}
          // onChange={handleChange}
          options={years}
        />
      </Form.Item>
      <Form.Item label="Рейтинг от" name="ratingFrom">
        <Input
          style={{
            width: 50,
            MozAppearance: 'textfield',
            // WebkitAppearance: 'none'
          }}
          type="number"

          min={0}
          max={10}
          placeholder="рейтинг"
        ></Input>
      </Form.Item>
      <Form.Item label="До" name="ratingTo">
        <Input
          style={{
            width: 50,
            MozAppearance: 'textfield',
            // WebkitAppearance: 'none'

          }}
          type="number"

          min={0}
          max={10}
          className="[&::-webkit-inner-spin-button]:appearance-none"
          placeholder="Rating"
        ></Input>
      </Form.Item>
    </Form>
  );
};

export default Filter;
