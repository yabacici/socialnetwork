// import app from "./app";
// import { render, waitFor, fireEvent } from "@testing-library-react";
// import axios from "./axios";

// jest.mock("./axios");

// axios.get.mockResolvedVALUE({
//     data: {
//         first: "ma",
//         last: "am",
//         profile_pic_url: "https://www.fillmurray.com/500/500",
//         id: 1,
//     },
// });

// test("app stuff", async () => {
//     const test = render(<app />);
//     console.log("test:", test);
// });

// console.log("testing...");
// const myMockfn = jest.fn((n) => n >= 18);

// test("filter calls function properly", () => {
//     const a = [22, 15, 37];
//     a.filter(myMockfn);
//     console.log("myMockFn.mock:", myMockfn.mock);

//     expect(myMockfn.mock.calls.length).toBe(3);
//     expect(myMockfn.mock.results[0].value).toBeTruthy();
//     expect(myMockfn.mock.results[0].value).toBeTruthy();
//     expect(myMockfn.mock.results[1].value).toBe(false);
// });
