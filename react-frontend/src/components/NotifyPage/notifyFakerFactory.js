
import { faker } from "@faker-js/faker";
export default (user,count,latihanIds) => {
    let data = [];
    for (let i = 0; i < count; i++) {
        const fake = {
latihan: latihanIds[i % latihanIds.length],
venue: faker.lorem.sentence(1),
tarikh: faker.lorem.sentence(1),
pengajur: faker.lorem.sentence(1),

updatedBy: user._id,
createdBy: user._id
        };
        data = [...data, fake];
    }
    return data;
};
