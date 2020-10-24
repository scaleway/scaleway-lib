import { pad, calc } from "..";

it("should calc", () => {
  expect(calc(2, 2)).toMatchSnapshot();
});

it("should pad", () => {
  expect(pad("hello", 10)).toMatchSnapshot();
});
