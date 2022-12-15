export type Organization = {
  _id: string;
  name: string;
  address: {
    street: string;
    city: string;
    zip: string;
    country: string;
  };
  coordinates: {
    longitude: string;
    latitude: string;
  };
  createdAt: string;
  updatedAt: string;
};

export type OrganizationList = Array<Omit<Organization, "">>;

export type CreateOrganizationDto = Omit<Organization, "_id coordinates">;
