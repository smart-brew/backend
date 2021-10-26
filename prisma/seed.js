const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function main() {
    let module = await db.modules.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'First module',
            description: 'Test module',
            Function_templates:{
                create: [
                {
                    name: 'GET_TEMP',
                    description: 'Returns temperature of chamber 1',
                },
                {
                    name: 'SET_RPM',
                    description: 'Sets rpms of engine 1',
                    params: {"rpms": "number"}
                },
                {
                    name: 'WAIT',
                    description: 'keeps executing previous instruction',
                    params: {"duration": "minutes"}
                },
            ]}
        },
        include:{
            Function_templates: true
        }
    })

    console.log(JSON.stringify(module,null,2))

    let recept1 = await db.recepies.upsert({
        where: { id: 1 },
        update: {},
        create: {
            name: 'Recepie test 1',
            description: 'Seed recepie 1',
            locked: false,
            Ingredients: {
                create: [
                    {
                        name: 'Some ingredient',
                        amount: 5.6,
                        type: 'Hops'
                    },
                    {
                        name: 'Some different ingredient',
                        amount: 1,
                        type: 'Yeast'
                    }
                ],
            },
            Instructions:{
                create: [
                    {
                        ordering: 1,
                        params: {"rpms": "100"},
                        Function_templates:{
                            connect:{
                                id:2
                            }
                        },
                        Steps: {
                            connectOrCreate:{
                                where: {
                                    name: 'initialization'
                                },
                                create:{
                                    name: 'initialization'
                                }
                            },
                        },                        
                    },
                    {
                        ordering: 2,
                        params: {"duration": "5"},
                        Function_templates:{
                            connect:{
                                id:3
                            }
                        },
                        Steps: {
                            connectOrCreate:{
                                where: {
                                    name: 'nextstep'
                                },
                                create:{
                                    name: 'nextstep'
                                }
                            },
                        },                        
                    }
                ]
            }
        },
        include:{
            Ingredients: true,
            Instructions:{
                include: {
                    Steps: true,
                }
            }
        }
    })
    
    console.log(JSON.stringify(recept1,null,2))

    let recept2 = await db.recepies.upsert({
        where: { id: 2 },
        update: {},
        create: {
            name: 'Recepie test 2',
            description: 'Seed recepie 2',
            locked: false,
            Ingredients: {
                create: [
                    {
                        name: 'American something',
                        amount: 4.8,
                        type: 'Fermentables'
                    },
                    {
                        name: 'Some tablet',
                        amount: 1,
                        type: 'Other'
                    }
                ],
            },
            Instructions:{
                create: [
                    {
                        ordering: 1,
                        params: {"rpms": "200"},
                        Function_templates:{
                            connect:{
                                id:2
                            }
                        },
                        Steps: {
                            connectOrCreate:{
                                where: {
                                    name: 'initialization'
                                },
                                create:{
                                    name: 'initialization'
                                }
                            },
                        },                        
                    },
                    {
                        ordering: 2,
                        Function_templates:{
                            connect:{
                                id:1
                            }
                        },
                        Steps: {
                            connectOrCreate:{
                                where: {
                                    name: 'differentstep'
                                },
                                create:{
                                    name: 'differentstep'
                                }
                            },
                        },                        
                    }
                ]
            }
        },
        include:{
            Ingredients: true,
            Instructions:{
                include: {
                    Steps: true,
                }
            }
        }
    })

    console.log(JSON.stringify(recept2,null,2))

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })