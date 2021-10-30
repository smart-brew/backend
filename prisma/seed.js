const { PrismaClient } = require('@prisma/client')
const db = new PrismaClient()

async function main() {
    await db.function_templates.upsert({
        where: { code_name: "SET_TEMPERATURE" },
        update: {},
        create: {
            code_name: "SET_TEMPERATURE",
            name: "Temperature",
            category: "TEMPERATURE",
            units: "°C",
            input_type: "float",
            description: "Sets temerature for selected chamber",
            Function_options:{
                create: [
                {
                    name: "Chamber 1",
                    code_name: "TEMP_1",
                    module: 1,
                },
                {
                    name: "Chamber 2",
                    code_name: "TEMP_2",
                    module: 1,
                },
            ]}
        }
    })

    await db.function_templates.upsert({
        where: { code_name: "SET_MOTOR_SPEED" },
        update: {},
        create: {
            code_name: "SET_MOTOR_SPEED",
            name: "Motor",
            category: "MOTOR",
            units: "RMP",
            input_type: "float",
            description: "Sets rpms for selected motor",
            Function_options:{
                create: [
                {
                    name: "Motor 1",
                    code_name: "MOTOR_1",
                    module: 2,
                },
                {
                    name: "Motor 2",
                    code_name: "MOTOR_2",
                    module: 2,
                },
            ]}
        }
    })

    await db.function_templates.upsert({
        where: { code_name: "TRANSFER_LIQUIDS" },
        update: {},
        create: {
            code_name: "TRANSFER_LIQUIDS",
            name: "Transfer liquids",
            category: "PUMP",
            description: "Transfers liquids from first chamber to second",
            Function_options:{
                create: [
                {
                    name: "Pump 1",
                    code_name: "PUMP_1",
                    module: 3,
                },
            ]}
        }
    })

    await db.function_templates.upsert({
        where: { code_name: "UNLOAD" },
        update: {},
        create: {
            code_name: "UNLOAD",
            name: "Unload",
            category: "UNLOADER",
            description: "Unloads selected ingredient into chamber",
            Function_options:{
                create: [
                {
                    name: "Fermentables",
                    code_name: "FERMENTABLE",
                    module: 4,
                },
                {
                    name: "Yeast",
                    code_name: "YEAST",
                    module: 4,
                },
                {
                    name: "Hops",
                    code_name: "HOPS",
                    module: 4,
                },
                {
                    name: "Other",
                    code_name: "OTHER",
                    module: 4,
                },
            ]}
        }
    })

    await db.function_templates.upsert({
        where: { code_name: "WAIT" },
        update: {},
        create: {
            code_name: "WAIT",
            name: "Wait",
            category: "SYSTEM",
            units: "Minutes",
            input_type: "float",
            description: "System will wait for given amount of minues",           
        }
    })

    await db.function_templates.upsert({
        where: { code_name: "MANUAL" },
        update: {},
        create: {
            code_name: "MANUAL",
            name: "Manual step",
            category: "SYSTEM",
            input_type: "string",
            description: "System will wait for manual inervention",           
        }
    })

    let recept1 = await db.recipes.upsert({
        where: { name: "TEST_RECIPE_1" },
        update: {},
        create: {
            name: "TEST_RECIPE_1",
            description: "Seed recipe 1",
            locked: false,
            Ingredients: {
                create: [
                    {
                        name: "Some ingredient",
                        amount: 5.6,
                        type: "Hops"
                    },
                    {
                        name: "Some different ingredient",
                        amount: 1,
                        type: "Yeast"
                    }
                ],
            },
            Blocks:{
                create:[
                    {
                        name: "Initialization",
                        Instructions:{
                            create: [
                                {
                                    ordering: 1,
                                    param: {"rpms": "100"},
                                    Function_templates:{
                                        connect:{
                                            code_name: "SET_MOTOR_SPEED"
                                        }
                                    }, 
                                    Function_options:{
                                        connect:{
                                            code_name: "MOTOR_1"
                                        }
                                    }                                        
                                },
                                {
                                    ordering: 2,
                                    param: {"duration": "5"},
                                    Function_templates:{
                                        connect:{
                                            code_name: "WAIT"                                        }
                                    },                                          
                                }
                            ]
                        }

                    },
                    {
                        name: "NextBlock",
                        Instructions:{
                            create: [
                                {
                                    ordering: 3,
                                    param: {"temp": "60"},
                                    Function_templates:{
                                        connect:{
                                            code_name: "SET_TEMPERATURE",
                                        }
                                    }, 
                                    Function_options:{
                                        connect:{
                                            code_name: "TEMP_1",
                                        }
                                    }                                        
                                },
                                {
                                    ordering: 4,
                                    Function_templates:{
                                        connect:{
                                            code_name: "UNLOAD",
                                        }
                                    }, 
                                    Function_options:{
                                        connect:{
                                            code_name: "FERMENTABLE",
                                        }
                                    }                                          
                                }
                            ]
                        }
                    }
                ]
            }
        },
        include:{
            Ingredients: true,
            Blocks:{
                include: {
                    Instructions: {
                        include:{
                            Function_templates: true,
                            Function_options: true,
                        }
                    },
                }
            }
        }
    })
    
    console.log(JSON.stringify(recept1,null,2))

}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await db.$disconnect()
    })