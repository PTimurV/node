import express from "express";
import {libraryService} from "../domain/library-service";
import {
    RequestWithBody,
    RequestWithParams,
    RequestWithPararmsAndBody,
    RequestWithQuery
} from "../types";
import {CreateBookModel} from "../models/CreateBookModel";
import {BookType} from "../repositories/dbMongo-library";
import {BookViewModel} from "../models/BookViewModel";
import {QueryBooksModel} from "../models/QueryBooksModel";
import {booksRepository} from "../repositories/books-db-repository";
import {URIParamsBookIdModel} from "../models/URIParamsBookIdModel";
import {body} from "express-validator";
import {
    inputValidationMiddleware
} from "../middlewares/input-validation-middleware";
 import {UpdateBookModels} from "../models/UpdateBookModels";

export const getBookViewModel = (dbCourse: BookType): BookViewModel => {
    return {
        id: dbCourse.id,
        title: dbCourse.title,
        author: dbCourse.author,
        publicationYear: dbCourse.publicationYear,
        isAvailable: dbCourse.isAvailable,
        borrower: dbCourse.borrower,
        dueDate: dbCourse.dueDate
    }
}

const titleValidationMidleware = body('title').trim().isLength({min:3,max:20})
const authorValidationMiddleware = body('author')
    .trim()
    .isLength({ min: 3, max: 50 }) 
    .matches(/^[a-zA-Z\s-]+$/, 'i')
    .withMessage('Автор может содержать только буквы, пробелы и дефисы');
const publicationYearValidationMiddleware = body('publicationYear')
    .trim()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Год должен быть числом и находиться в диапазоне от 1000 до текущего года');
const isAvailableValidationMiddleware = body('isAvailable')
    .optional()
    .isBoolean()
    .withMessage('Значение поля, если указано, должно быть булевым');
const borrowerValidationMidleware = body('borrower').trim().trim()
    .isLength({ min: 3, max: 50 }) 
    .matches(/^[a-zA-Z\s-]+$/, 'i')
    .withMessage('Имя пользователя может содержать только буквы, пробелы и дефисы');
const dueDateValidationMidleware = body('dueDate').trim().trim()
    .isLength({ min: 10, max: 10 })
    .withMessage('Должна быть указана дата')
    .custom((value, { req }) => {
        const currentDate = new Date();
        const dueDate = new Date(value);

        if (isNaN(dueDate.getTime())) {
            throw new Error('Некорректный формат даты');
        }

        const oneMonthLater = new Date();
        oneMonthLater.setMonth(currentDate.getMonth() + 1);

        // Проверка, что разница между датой и текущим временем не меньше месяца
        if (dueDate < oneMonthLater) {
            throw new Error('Разница между датой и текущим временем не может быть меньше месяца');
        }
        const threeMonthsLater = new Date();
        threeMonthsLater.setMonth(currentDate.getMonth() + 3);

        if (dueDate > threeMonthsLater) {
            throw new Error('Разница между датой и текущим временем не может быть больше трех месяцев');
        }

        return true;
    });




export const getLibraryRouter=()=>{

    const router = express.Router()

    router.get('/', async (req:RequestWithQuery<QueryBooksModel>, res) => {
        const foundBooks: BookType[]  = await booksRepository.findBooks(req.query.title?.toString(),req.query.author?.toString(),req.query.sortField?.toString(),req.query.sortOrder?.toString());
        res.json(foundBooks)
    })

    router.get('/:id', async (req:RequestWithParams<URIParamsBookIdModel>, res) => {
        const foundBooks: BookType|null  = await booksRepository.getBookById(+req.params.id);
        if (!foundBooks) {
        if (!foundBooks) {
            res.sendStatus(404);
            return;
        }
        res.json(getBookViewModel(foundBooks))
    })

    router.post('/',
        titleValidationMidleware,
        authorValidationMiddleware,
        publicationYearValidationMiddleware,
        isAvailableValidationMiddleware,
        inputValidationMiddleware,
        async (req:RequestWithBody<CreateBookModel>, res) => {
        const createdCourse= await libraryService.createBook(req.body.title,req.body.author,
            req.body.publicationYear,req.body.isAvailable)
        res.status(201).json(createdCourse) 
    })

    router.put('/:id/borrow',
        borrowerValidationMidleware,
        dueDateValidationMidleware,
        inputValidationMiddleware,
        async (req:RequestWithPararmsAndBody<URIParamsBookIdModel,UpdateBookModels>, res) => {
        const isBorrow= await libraryService.borrowBook(+req.params.id,req.body.borrower,req.body.dueDate)
        if (isBorrow){
            const foundBooks: BookType | null = await booksRepository.getBookById(+req.params.id)
            if (!foundBooks) {
                res.sendStatus(404);
                return;
            }
            res.json(getBookViewModel(foundBooks))
        }else {
            res.sendStatus(404)
        }
    })

    router.put('/:id/return',
        async (req:RequestWithPararmsAndBody<URIParamsBookIdModel,UpdateBookModels>, res) => {
            const isReturn= await libraryService.returnBook(+req.params.id)
            if (isReturn){
                const foundBooks: BookType | null = await booksRepository.getBookById(+req.params.id)
                if (!foundBooks) {
                    res.sendStatus(404);
                    return;
                }
                res.json(getBookViewModel(foundBooks))
            }else {
                res.sendStatus(404)
            }
        })
    return router
    
}