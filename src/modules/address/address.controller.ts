import Address from "./address.model";
import { ApiError } from "../../utils/ApiError";


export const createAddress = async (req: any, res: any) => {
    const address = await Address.create({
        ...req.body,
        user: req.user.id
    });

    res.status(201).json(address);
};


export const getMyAddresses = async (req: any, res: any) => {
    const addresses = await Address.find({ user: req.user.id });

    res.json(addresses);
};


export const updateAddress = async (req: any, res: any) => {
    const address = await Address.findOneAndUpdate(
        { _id: req.params.id, user: req.user.id },
        req.body,
        { new: true }
    );

    if (!address) throw new ApiError(404, "Address not found");

    res.json(address);
};


export const deleteAddress = async (req: any, res: any) => {
    await Address.findOneAndDelete({
        _id: req.params.id,
        user: req.user.id
    });

    res.json({ message: "Address deleted" });
};