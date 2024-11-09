import asyncHandler from "express-async-handler";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { List } from "../models/list.model.js";


export const ApproveList = asyncHandler(async(req,res)=>{
    const user = req.user;

    if(user.role != "HOD"){
        return res.status(400).json({
            success:false,
            message:"You are not allowed to access this resources"
        })
    }

    const {status} = req.body;
    const {id} = req.params;

    const newStatus = status === "approve" ? "Approved" : status === "reject" ? "Not Approved":null;

    if (!newStatus) {
        return res.status(400).json({
            success: false,
            message: "Invalid action specified"
        });
    }
    
    try {
        await List.findByIdAndUpdate(id,{status:newStatus})

        return res.status(200).json({
            success: true,
            message: `Items ${newStatus.toLowerCase()} successfully`,
            updatedItems: list
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating status in the database",
            error: error.message
        });
    }

})

export const getList = asyncHandler(async(req,res)=>{
    if(user.role != "HOD"){
        return res.status(400).json({
            success:false,
            message:"You are not allowed to access this resources"
        })
    }

    const user = req.user;
    try{
        const list = await List.find({to:user.id});

        return res.status(200).json({
            success:true,
            data:list
        })

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error retrieving list",
            error: error.message
        });
    }
})