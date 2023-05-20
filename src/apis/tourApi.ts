interface GetTourApi {
  query: {
    age: number;
    id: number;
    name: string;
  };
  res: {
    status: 'success';
    data: {
      list: any[];
      length: number;
    };
  };
}

export { GetTourApi };
