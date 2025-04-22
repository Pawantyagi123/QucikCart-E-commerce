import { Inngest } from "inngest";
import { connect } from "mongoose";
import ConnectDB from "./db";
import User from "@/models/User";

export const inngest = new Inngest({
    id: "quickcart-next"
})

// inngest function to save user data to database
export const saveUserData = inngest.createFunction(
    { id: "sync-user-from-clerk" },
    { event: "clerk/user.created" },

    async ({ event }) => {
        const { id,first_name,last_name, email_addresses, image_url  } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url,
        }
        await ConnectDB()
        await User.create(userData)
    }
)

// inngest function to update user data in database

export const updateUserData = inngest.createFunction(
    { id: "update-user-data" },
    { event: "clerk/user.updated" },

    async ({ event }) => {
        const { id, first_name, last_name, email_addresses, image_url } = event.data
        const userData = {
            _id: id,
            email: email_addresses[0].email_address,
            name: `${first_name} ${last_name}`,
            imageUrl: image_url,
        }
        await ConnectDB()
        await User.findByIdAndUpdate(id, userData)
    }
)

// inngest function to delete user data from database

export const deleteUserData = inngest.createFunction(
    { id: "delete-user-data" },
    { event: "clerk/user.deleted" },

    async ({ event }) => {
        const { id } = event.data
        await ConnectDB()
        await User.findByIdAndDelete(id)
    }
)