import { List } from "../models/list.model.js";



export const createList = async(req,res)=>{
    const user = req.user;

    if(user.role != "Manager"){
        return res.status(400).json({
            success:false,
            message:"You are not allowed to access this resources"
        })
    }

    const list = req.body.list;

    try{
        await List.create({
            List:list,
        })

        return res.status(200).json({
            success:false,
            message:"List created successfully"
        })
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
}

export const sendList= async(req,res)=>{
    const user = req.user;

    if(user.role != "Manager"){
        return res.status(400).json({
            success:false,
            message:"You are not allowed to access this resources"
        })
    }

    const {_to} = req.body;
    const {id} = req.params;

    try {
        await List.findByIdAndUpdate(id,{to:_to})

        return res.status(200).json({
            success: true,
            message: `Send for approval successfully`,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error.message
        });
    }
}
