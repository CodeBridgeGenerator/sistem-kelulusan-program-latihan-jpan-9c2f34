import React from "react";
import { render, screen } from "@testing-library/react";

import PelulusPage from "../PelulusPage";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import { init } from "@rematch/core";
import { Provider } from "react-redux";
import * as models from "../../../models";

test("renders pelulus page", async () => {
    const store = init({ models });
    render(
        <Provider store={store}>
            <MemoryRouter>
                <PelulusPage />
            </MemoryRouter>
        </Provider>
    );
    expect(screen.getByRole("pelulus-datatable")).toBeInTheDocument();
    expect(screen.getByRole("pelulus-add-button")).toBeInTheDocument();
});
