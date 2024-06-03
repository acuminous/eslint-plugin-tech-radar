const parse = require('../src/parse-tech-radar');

const goodCsv = `name,ring,quadrant,isNew,description
prisma,hold,backend,FALSE,ORM
typeorm,hold,backend,FALSE,ORM
orchid-orm,trial,backend,FALSE,ORM
sequelize,adopt,backend,FALSE,ORM
react,adopt,frontend,FALSE,UI`;

const badCsv = `name,ring,quadrant,isNew,description
prisma,hold,backend,FALSE,ORM
typeorm,hold,backend,FALSE,ORM
orchid-orm,trial,backend,FALSE,ORM
sequelize,adopt,backend,FALSE`;

describe('parse-tech-radar', () => {

  it('should parse tech radar csv', async () => {
    const radar = parse(goodCsv);
    expect(radar.hold).toHaveLength(2);
    expect(radar.hold[0]).toEqual('prisma');
    expect(radar.hold[1]).toEqual('typeorm');
    expect(radar.assess).toHaveLength(0);
    expect(radar.trial).toHaveLength(1);
    expect(radar.trial[0]).toEqual('orchid-orm');
    expect(radar.adopt).toHaveLength(2);
    expect(radar.adopt[0]).toEqual('sequelize');
  });

  it('should filter tech radar csv', async () => {
    const radar = parse(goodCsv, 'backend');
    expect(radar.hold).toHaveLength(2);
    expect(radar.hold[0]).toEqual('prisma');
    expect(radar.hold[1]).toEqual('typeorm');
    expect(radar.assess).toHaveLength(0);
    expect(radar.trial).toHaveLength(1);
    expect(radar.trial[0]).toEqual('orchid-orm');
    expect(radar.adopt).toHaveLength(1);
    expect(radar.adopt[0]).toEqual('sequelize');
  });

  it('should report parse errors', async () => {
    expect(() => parse(badCsv)).toThrow('Too few fields: expected 5 fields but parsed 4');
  });

});
