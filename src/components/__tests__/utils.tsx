import * as API from "../../providers/ApiProvider";

export type APIStub = jest.SpyInstance<
  {
    create: API.RequestHook;
    delete: API.RequestHook;
    list: API.RequestHook;
  },
  []
>;

export const createAPI = (
  args: {
    create?: any;
    delete?: any;
    list?: any;
  } = {}
) => {
  const create = args.create || [{}];
  const del = args.delete || [{}];
  const list = args.list || [{}];

  return jest.spyOn(API, "useAPI").mockReturnValue({
    ...args,
    create: [
      {
        data: undefined,
        loading: false,
        error: undefined,
        ...create[0],
      },
      create[1] || jest.fn(),
    ],
    delete: [
      {
        data: undefined,
        loading: false,
        error: undefined,
        ...del[0],
      },
      del[1] || jest.fn(),
    ],
    list: [
      {
        data: undefined,
        loading: false,
        error: undefined,
        ...list[0],
      },
      list[1] || jest.fn(),
    ],
  });
};
