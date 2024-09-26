
import { faker } from "@faker-js/faker";
export default (user,count,penggunaIds,latihanIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
pengguna: penggunaIds[i % penggunaIds.length],
latihan: latihanIds[i % latihanIds.length],
status: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
