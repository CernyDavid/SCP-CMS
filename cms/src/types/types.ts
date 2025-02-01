export type Category = {
    id: string
    name: string
    description?: string | null
  }
  
  export type Article = {
    id: string
    title: string
    content: string
    createdAt: Date
    updatedAt: Date
    authorId: string
    categoryId: string
    category: Category
  }
  
  export type CreateArticleInput = {
    title: string
    content: string
    categoryId: string
  }