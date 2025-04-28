import { z } from "zod";

// Category model
export const schemaCategory = z.object({
    id: z.string().cuid2(),
    // category name
    name: z.string().min(2).max(32),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
});

// Category model
export const schemaCategoryCreate = z.object({
    // category name
    name: z.string().min(2).max(32)
});

// Category model
export const schemaCategoryCreateItem = z.object({
    // category name
    name: z.string().min(2).max(32)
});

// Category model
export const schemaCategoryUpdate = z.object({
    id: z.string().cuid2().optional(),
    // category name
    name: z.string().min(2).max(32).optional()
});

// Post model
export const schemaPost = z.object({
    id: z.string().cuid2(),
    title: z.string().min(1),
    // Markdown formatted string
    body: z.string().min(1),
    categories: z.array(z.object({
        id: z.string().cuid2(),
        // category name
        name: z.string().min(2).max(32),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime()
    })),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
});

// Post model
export const schemaPostCreate = z.object({
    title: z.string().min(1),
    // Markdown formatted string
    body: z.string().min(1),
    categories: z.array(z.object({
        // category name
        name: z.string().min(2).max(32)
    }))
});

// Post model
export const schemaPostCreateItem = z.object({
    title: z.string().min(1),
    // Markdown formatted string
    body: z.string().min(1),
    categories: z.array(z.object({
        // category name
        name: z.string().min(2).max(32)
    }))
});

// Post model
export const schemaPostUpdate = z.object({
    id: z.string().cuid2().optional(),
    title: z.string().min(1).optional(),
    // Markdown formatted string
    body: z.string().min(1).optional(),
    categories: z.array(z.object({
        id: z.string().cuid2(),
        // category name
        name: z.string().min(2).max(32),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime()
    })).optional()
});

// User model
export const schemaUser = z.object({
    id: z.string().cuid2(),
    // username
    name: z.string().min(2).max(32),
    email: z.string().email(),
    age: z.number().int().gte(18),
    posts: z.array(z.object({
        id: z.string().cuid2(),
        title: z.string().min(1),
        // Markdown formatted string
        body: z.string().min(1),
        categories: z.array(z.object({
            id: z.string().cuid2(),
            // category name
            name: z.string().min(2).max(32),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime()
        })),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime()
    })),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime()
});

// User model
export const schemaUserCreate = z.object({
    // username
    name: z.string().min(2).max(32),
    email: z.string().email(),
    age: z.number().int().gte(18),
    posts: z.array(z.object({
        title: z.string().min(1),
        // Markdown formatted string
        body: z.string().min(1),
        categories: z.array(z.object({
            // category name
            name: z.string().min(2).max(32)
        }))
    }))
});

// User model
export const schemaUserUpdate = z.object({
    id: z.string().cuid2().optional(),
    // username
    name: z.string().min(2).max(32).optional(),
    email: z.string().email().optional(),
    age: z.number().int().gte(18).optional(),
    posts: z.array(z.object({
        id: z.string().cuid2(),
        title: z.string().min(1),
        // Markdown formatted string
        body: z.string().min(1),
        categories: z.array(z.object({
            id: z.string().cuid2(),
            // category name
            name: z.string().min(2).max(32),
            createdAt: z.string().datetime(),
            updatedAt: z.string().datetime()
        })),
        createdAt: z.string().datetime(),
        updatedAt: z.string().datetime()
    })).optional()
});

export const schemaCuid2 = z.string().cuid2();

export const pathCategoriesGet = z.object({
    id: z.string().cuid2()
});

export const pathCategoriesDelete = z.object({
    id: z.string().cuid2()
});

export const pathCategoriesUpdate = z.object({
    id: z.string().cuid2()
});

export const pathPostsGet = z.object({
    id: z.string().cuid2()
});

export const pathPostsDelete = z.object({
    id: z.string().cuid2()
});

export const pathPostsUpdate = z.object({
    id: z.string().cuid2()
});

export const pathUsersGet = z.object({
    id: z.string().cuid2()
});

export const pathUsersDelete = z.object({
    id: z.string().cuid2()
});

export const pathUsersUpdate = z.object({
    id: z.string().cuid2()
});

export const queryCategoriesList = z.object({
    limit: z.string().optional().default("20"),
    offset: z.string().optional().default("0")
});

export const queryPostsList = z.object({
    limit: z.string().optional().default("20"),
    offset: z.string().optional().default("0")
});

export const queryUsersList = z.object({
    limit: z.string().optional().default("20"),
    offset: z.string().optional().default("0")
});