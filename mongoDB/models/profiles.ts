import mongoose, { Schema } from 'mongoose'

const profileScheme = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        surname: {
            type: String,
            required: true
        }
    },
    { versionKey: '_somethingElse' }
)

profileScheme.set('toJSON', {
    transform: function (doc, ret) {
        ret.id = ret._id
        delete ret._id
    },
})

const Profile = mongoose.models.Profile || mongoose.model('Profile', profileScheme)
export default Profile