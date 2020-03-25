class Applicants::UsersController < Applicants::UserBaseController
  before_action :is_current_user

  def index
      @user_favorites = UserFavorite.all
  end

  def create

  end

  def show
      @user_favorites = UserFavorite.find(params[:id])
    end
    
  def destroy
  @user_favorite = UserFavorite.find(params[:id])
  @user_favorite.destroy!
  redirect_to '/applicants/favorites', :notice => "Your favorite has been deleted"
  end
  
  private
  
  def job_params
      params.require(:user_favorite).permit(:user_id, :job_id)
  end
    
  def is_current_user
    user_url_id = params['user_id'].to_i
    unless current_user.id == user_url_id
        redirect_to root_path
    end
  end
end
